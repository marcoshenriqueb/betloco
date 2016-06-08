from market.models import Choice, Operation, Order

class OrderEngine():
    """Responsible for orders price-time matching"""
    def __init__(self, order):
        self.order = order

    def findMatchingOffers(self):
        currentUserId = self.order.user.id
        currentOfferPrice = self.order.price
        if self.order.amount > 0:
            array = self.order.choice._getTopToBuy(1000)
            offers = [o for o in array \
                        if o.price <= currentOfferPrice and o.user.id != currentUserId]
            amountBalance = self.order.amount
        else:
            array = self.order.choice._getTopToSell(1000)
            offers = [o for o in array \
                        if o.price >= currentOfferPrice and o.user.id != currentUserId]
            amountBalance = self.order.amount * (-1)
        remainingAmountOffer = self.order
        if offers:
            for o in offers:
                amount = min([o.amount, amountBalance])
                price = o.price
                Operation.objects.create(
                    from_order=self.order,
                    to_order=o,
                    amount=amount,
                    price=price
                )
                if o.amount > amountBalance:
                    amountBalance = o.amount - amountBalance
                    remainingAmountOffer = o
                    break
                else:
                    amountBalance = amountBalance - amount
            if self.order.id != remainingAmountOffer.id:
                if self.order.choice.id == remainingAmountOffer.choice.id:
                    amountBalance = amountBalance if self.order.amount < 0 else amountBalance * (-1)
                else:
                    remainingAmountOffer.price = 1 - remainingAmountOffer.price
                    amountBalance = amountBalance if self.order.amount > 0 else amountBalance * (-1)
            else:
                amountBalance = amountBalance if self.order.amount > 0 else amountBalance * (-1)
                print(amountBalance)
            Order.objects.create(
                user=remainingAmountOffer.user,
                choice=remainingAmountOffer.choice,
                amount=amountBalance,
                price=remainingAmountOffer.price
            )
