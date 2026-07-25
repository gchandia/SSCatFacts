import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await AuthService.register(username, password);
      return res.status(201).json({ message: 'Usuario registrado con éxito', user });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const data = await AuthService.login(username, password);
      return res.json(data);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }
}
