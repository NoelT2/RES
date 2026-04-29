import re
import hashlib

def validate_email(email):
pattern = r'^[\w.-]+@[\w.-]+.\w+$'
return re.match(pattern, email) is not None

def get_domain(email):
return email.split("@")[1] if "@" in email else None

def gravatar_url(email):
email_hash = hashlib.md5(email.lower().encode()).hexdigest()
return f"https://www.gravatar.com/avatar/{email_hash}?d=404"

def risk_score(valid, breached):
if not valid:
return "INVALID"
if breached:
return "HIGH"
return "LOW"