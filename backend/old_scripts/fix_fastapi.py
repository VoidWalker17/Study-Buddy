with open("frontend/api/routers/ml_routes.py", "r") as f:
    code = f.read()

code = code.replace('prefix="/ml"', 'prefix="/api/ml"')

with open("frontend/api/routers/ml_routes.py", "w") as f:
    f.write(code)

print("Fixed router prefix")
