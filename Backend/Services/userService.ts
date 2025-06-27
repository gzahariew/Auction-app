import { AppDataSource } from '../src/data-source';
import { User } from '../src/entity/User';
import * as bcrypt from 'bcryptjs';
import { ConflictError, NotFoundError } from '../errors/AppErr';

class UserService {
    private userRepository = AppDataSource.getRepository(User);
    registerAuction: any;

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundError(`User with ID ${id} not found.`);
        }
        return user;
    }

    async registerUser(username: string, email: string, password: string,): Promise<User> {
        const existingUser = await this.userRepository.findOneBy({ email });
        if (existingUser) {
            throw new ConflictError("User with this email already exists.");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = this.userRepository.create({
            username,
            email,
            password: hashedPassword,
            isActive: true
        });

        return this.userRepository.save(newUser);
    }

    async loginUser(email: string, password: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new NotFoundError("Invalid credentials.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new NotFoundError("Invalid credentials.");
        }

        return user;
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        const userToUpdate = await this.userRepository.findOneBy({ id });
        if (!userToUpdate) {
            throw new NotFoundError(`User with ID ${id} not found.`);
        }

        if (userData.password) {
            const saltRounds = 10;
            userData.password = await bcrypt.hash(userData.password, saltRounds);
        }

        this.userRepository.merge(userToUpdate, userData);
        return this.userRepository.save(userToUpdate);
    }

    async deleteUser(id: number): Promise<void> {
        const deleteResult = await this.userRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new NotFoundError(`User with ID ${id} not found.`);
        }
    }
}

export const userService = new UserService();