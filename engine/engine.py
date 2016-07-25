from market.models import Operation, Order, Market
from django.contrib.auth.models import User

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
            array = self.order.market._getTopToBuy(10000, group=False)
            self.offers = [o for o in array \
                        if o.price <= currentOfferPrice]
            self.amountBalance = self.order.amount
        elif self.order.amount < 0:
            array = self.order.market._getTopToSell(10000, group=False)
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
                    price=price,
                    from_liquidation=self.order.from_liquidation
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
                self.amountBalance = self.amountBalance if self.order.amount < 0 else self.amountBalance * (-1)
            # If it is, saves to transaction the remaining
            else:
                self.amountBalance = self.amountBalance if self.order.amount > 0 else self.amountBalance * (-1)

            if self.amountBalance != 0:
                o = Order.objects.create(
                    user=self.remainingAmountOffer.user,
                    market=self.remainingAmountOffer.market,
                    amount=self.amountBalance,
                    price=self.remainingAmountOffer.price,
                    residual=1,
                    from_liquidation=self.remainingAmountOffer.from_liquidation
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
        self.placeLiquidationOrders()

    def cancelPendingOrders(self):
        pending_orders = self.market.order_set.filter(from_order__isnull=True) \
                                    .filter(to_order__isnull=True) \
                                    .filter(deleted=0) \
                                    .update(deleted=1)

    def placeLiquidationOrders(self):
        positions = Order.objects.getAllMarketPositions(self.market.id)
        for p in positions:
            print(p)
            price = 0
            if self.market.winner:
                price = 1
            Order.objects.create(
                user_id=p['user__id'],
                market_id=p['market__id'],
                amount=p['position']*-1,
                price=price,
                from_liquidation=1
            )
