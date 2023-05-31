import bcrypt


class Hash:
    def bcrypt(password: str):
        bytePwd = password.encode('utf-8')
        return bcrypt.hashpw(bytePwd, bcrypt.gensalt())

    def verify(hashed_password: str, plain_password: str):
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
