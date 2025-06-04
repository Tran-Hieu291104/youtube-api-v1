import passport from 'passport';
import {
  Profile,
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';

passport.use(
  new GoogleStrategy(
    {
      clientID: '78794365796-3k35oj3illi7ua0ac9de2650i75mijaf.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3001/api/auth/google/redirect',
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.force-ssl',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',

      ],
    },
    async (accessToken: string, refreshToken: string, profile, done: VerifyCallback) => {
      console.log('Access Token:', accessToken);
      console.log('Profile:', profile);
      done(null, { accessToken, profile });
    }
  )
);
export default passport;