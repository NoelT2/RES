from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import validate_email, get_domain, gravatar_url, risk_score

app = Flask(name)
CORS(app)


def check_breach(email):
return any(x in email.lower() for x in ["test", "admin", "root"])

@app.route('/check-multiple', methods=['POST'])
def check_multiple():
data = request.get_json()
emails = data.get("emails", [])

results = []

for email in emails:
    valid = validate_email(email)
    domain = get_domain(email)
    breached = check_breach(email)
    avatar = gravatar_url(email)

    results.append({
        "email": email,
        "valid": valid,
        "domain": domain,
        "breach": breached,
        "avatar": avatar,
        "risk": risk_score(valid, breached)
    })

return jsonify(results)

if name == 'main':
app.run(debug=True)