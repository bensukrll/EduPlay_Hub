# ==================================================
#  MAIL AYARLARI 
# ==================================================

def setCred():
    cred_file = open("pass.wd","r")
    MAIL_ADDRESS = cred_file.readline()
    MAIL_PASSWORD = cred_file.readline()
    cred_file.close()
    return (MAIL_ADDRESS, MAIL_PASSWORD)