# ==================================================
#  MAIL AYARLARI 
# ==================================================

def setCred():
    with open("pass.wd", "r") as f:
        lines = f.read().splitlines()
    return (lines[0], lines[1])

def getDbConfig():
    with open("pass.wd", "r") as f:
        lines = f.read().splitlines()
    return {
        "host": lines[2],
        "database": "postgres",
        "user": lines[3],
        "password": lines[4],
        "port": "5432"
    }

def getSecretKey():
    with open("pass.wd", "r") as f:
        lines = f.read().splitlines()
    return lines[5]