import { Strategy } from 'passport';
import 'dotenv/config';

export interface PassportStrategy {
    name: string;
    strategy: Strategy;
}