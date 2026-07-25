import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';

export class AuthService {
  static async register(username: string, password: string) {
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres.');
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      throw new Error('El nombre de usuario ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
      data: { username, password: hashedPassword },
      select: { id: true, username: true, createdAt: true },
    });
  }

  static async login(username: string, password: string) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new Error('Credenciales inválidas.');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Credenciales inválidas.');

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    return { token, user: { id: user.id, username: user.username } };
  }
}
