import yagmail

def send_email(sender_email, receiver_email, subject, message, smtp_username, smtp_password):
    yag = yagmail.SMTP(smtp_username, smtp_password)
    yag.send(
        to=receiver_email,
        subject=subject,
        contents=message
    )


