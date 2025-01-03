import * as bcrypt from 'bcrypt';

export class Password {
  static hashPassword = async (password: string) => {
    const saltOrRounds = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  };
  static isMatch = async ({
    password,
    hash,
  }: {
    password: string;
    hash: string;
  }) => {
    return await bcrypt.compare(password, hash);
  };
}
