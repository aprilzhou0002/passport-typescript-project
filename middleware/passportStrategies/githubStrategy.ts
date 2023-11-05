import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { Request } from 'express';
import { userModel } from '../../models/userModel';
import dotenv from 'dotenv';
import passport from 'passport';

dotenv.config();

const githubStrategy = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID || '', 
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '', 
        callbackURL: process.env.CALLBACK_URL || '',
        passReqToCallback: true,
    },
    async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: any) => {
        console.log(profile);
        let user = await userModel.findOneByGitHubId(profile.id);
        let name = profile.displayName || profile.username || '';
        
        if (!user) {
            const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '';
            user = userModel.addUser({
                githubId: profile.id,
                name: name,
                email: email,
            });
        }
        done(null, user);
    }
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;


