import passport from 'passport';
import {
  Profile,
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';

passport.use(
  new GoogleStrategy(
    {
      clientID: '108993774108-a0fr57u7e14pfn2k8b95as8hg5mbqjrs.apps.googleusercontent.com',
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