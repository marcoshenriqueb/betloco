from market.models import Choice, Operation, Order
from transaction.models import Transaction, TransactionDetail

class OrderEngine():
    """Responsible for orders price-time matching"""
    def __init__(self, order):
        self.order = order
        self.offers = []
        self.amountBalance = 0
        self.remainingAmountOffer = self.order

    def defineOffersArray(self):
        currentOfferPrice = self.order.price
        if self.order.amount > 0:
            array = self.order.choice._getTopToBuy(1000)
            self.offers = [o for o in array \
                        if o.price <= currentOfferPrice]
            self.amountBalance = self.order.amount
        elif self.order.amount < 0:
            array = self.order.choice._getTopToSell(1000)
            self.offers = [o for o in array \
                        if o.price >= currentOfferPrice]
            self.amountBalance = self.order.amount * (-1)

    def executeOrder(self):
        if self.offers:
            for o in self.offers:
                amount = min([o.amount, self.amountBalance])
                price = o.price
                # Makes the operation object for each price time match found
                Operation.objects.create(
                    from_order=self.order,
                    to_order=o,
                    amount=amount,
                    price=price
                )
                # Makes the respective transaction operation
                # Positive for sell orders and negative for buys
                t = Transaction.objects.create(
                    user=self.order.user,
                    transaction_type_id=4 if self.order.amount < 0 else 3,
                    currency_id=1,
                    value=amount*price if self.order.amount < 0 else amount*price*-1
                )
                TransactionDetail.objects.create(
                    transaction=t,
                    amount=amount if self.order.amount < 0 else amount*-1,
                    price=price,
                    order=self.order
                )
                # Saves opposite order transaction if it is a sell order, since
                # sell orders are not transacted untill materialized
                if (self.order.choice.id == o.choice.id and self.order.amount > 0) or \
                    (self.order.choice.id != o.choice.id and self.order.amount < 0):
                    t = Transaction.objects.create(
                        user=o.user,
                        transaction_type_id=4,
                        currency_id=1,
                        value=amount*price
                    )
                    TransactionDetail.objects.create(
                        transaction=t,
                        amount=amount,
                        price=price,
                        order=o
                    )
                # Breaks loop if remaning amount is less than this offer amount
                # That means that the current offer was completely executed
                # Sets saving variables for offer that will be created
                # with remaining amount
                if o.amount > self.amountBalance:
                    self.amountBalance = o.amount - self.amountBalance
                    self.remainingAmountOffer = o
                    break
                else:
                    self.amountBalance = self.amountBalance - amount

            # Checks if what is left is not from current order
            if self.order.id != self.remainingAmountOffer.id:
                if self.order.choice.id == self.remainingAmountOffer.choice.id:
                    self.amountBalance = self.amountBalance if self.order.amount < 0 else self.amountBalance * (-1)
                else:
                    self.remainingAmountOffer.price = 1 - self.remainingAmountOffer.price
                    self.amountBalance = self.amountBalance if self.order.amount > 0 else self.amountBalance * (-1)
            # If it is, saves to transaction the remaining
            else:
                self.amountBalance = self.amountBalance if self.order.amount > 0 else self.amountBalance * (-1)
                # Saves remaining amount Transaction only if is buy order and is from the current
                # user since the other user transaction were already saved and sell orders not
                # materialized aren't free of risk
                if self.amountBalance != 0 and self.order.amount > 0:
                    t = Transaction.objects.create(
                        user=self.order.user,
                        transaction_type_id=3,
                        currency_id=1,
                        value=self.amountBalance*self.remainingAmountOffer.price*-1
                    )
                    TransactionDetail.objects.create(
                        transaction=t,
                        amount=self.amountBalance*-1,
                        price=self.remainingAmountOffer.price,
                        order=self.order
                    )

            if self.amountBalance != 0:
                Order.objects.create(
                    user=self.remainingAmountOffer.user,
                    choice=self.remainingAmountOffer.choice,
                    amount=self.amountBalance,
                    price=self.remainingAmountOffer.price,
                    residual=1
                )
        # Creates transaction if order does not become a operation, but only if
        # it is a buy order, since sell orders are not free of risk
        else:
            if self.order.amount > 0:
                t = Transaction.objects.create(
                    user=self.order.user,
                    transaction_type_id=3,
                    currency_id=1,
                    value=self.order.amount*self.order.price*-1
                )
                TransactionDetail.objects.create(
                    transaction=t,
                    amount=self.order.amount*-1,
                    price=self.order.price,
                    order=self.order
                )

    def findMatchingOffers(self):
        self.defineOffersArray()
        self.executeOrder()
