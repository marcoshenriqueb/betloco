import paypalrestsdk
from django.conf import settings

class Paypal():
    """docstring for Paypal"""
    def __init__(self, data):
        paypalrestsdk.configure({
          "mode": "sandbox", # sandbox or live
          "client_id": settings.PAYPAL_CLIENT_ID,
          "client_secret": settings.PAYPAL_SECRET })
        self.payment = paypalrestsdk.Payment({
                "intent": "sale",
                "redirect_urls": {
                    "return_url": data['return_url'],
                    "cancel_url": data['cancel_url']
                },
                "payer":{
                    "payment_method": "paypal"
                },
                "transactions": [
                  {
                    "amount":
                    {
                      "total": data['value'],
                      "currency": "BRL"
                    },
                    "description": "Depósito para a conta do Guroo.",
                    "invoice_number": "merchant invoice"
                  }]
            })
    def create(self):
        if self.payment.create():
          print("Payment created successfully")
        else:
          print(payment.error)
