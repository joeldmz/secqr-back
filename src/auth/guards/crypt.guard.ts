import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptGuard {
    private readonly logger = new Logger('CryptGuard');
    
    async hashPassword(password: string): Promise<string> {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            this.logger.log('Password hashed successfully.');
            return hashedPassword;
        } catch (error) {
            throw new Error("Failed to process password");
        }
    }

    async comparePassword(plainPassword: string, storedHash: string): Promise<boolean> {
        try {
            const match = await bcrypt.compare(plainPassword, storedHash);
            return match; // Devuelve true o false
        } catch (error) {
            this.logger.error('Failed to compare password', error);
            throw new Error("Failed to compare password");
        }
    }

}
