from market.models import Choice, Operation, Order, Market

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
            array = self.order.choice._getTopToBuy(10000, group=False)
            self.offers = [o for o in array \
                        if o.price <= currentOfferPrice]
            self.amountBalance = self.order.amount
        elif self.order.amount < 0:
            array = self.order.choice._getTopToSell(10000, group=False)
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

            if self.amountBalance != 0:
                o = Order.objects.create(
                    user=self.remainingAmountOffer.user,
                    choice=self.remainingAmountOffer.choice,
                    amount=self.amountBalance,
                    price=self.remainingAmountOffer.price,
                    residual=1
                )
                o.created_at = self.remainingAmountOffer.created_at
                o.save()

    def findMatchingOffers(self):
        self.defineOffersArray()
        self.executeOrder()

class LiquidationEngine():
    """Responsible for market liquidation after event outcome"""
    def __init__(self, market_id):
        self.market = Market.objects.get(pk=market_id)
        self.cancelPendingOrders()

    def cancelPendingOrders(self):
        choices = self.market.choices.all()
        for c in choices:
            pending_orders = c.order_set.filter(from_order__isnull=True) \
                                    .filter(to_order__isnull=True) \
                                    .filter(deleted=0) \
                                    .update(deleted=1)
