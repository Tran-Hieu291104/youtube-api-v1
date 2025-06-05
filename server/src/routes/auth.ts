import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/google', passport.authenticate('google', { 
  scope: [
    'email',
    'profile',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ]
}));

router.get('/google/redirect', passport.authenticate('google', { session: false }), (req: any, res) => {
  const { accessToken, profile } = req.user;
  const email = profile?.emails?.[0]?.value || '';
  console.log('Redirect email:', email);
  res.redirect(`http://localhost:3001/signin?token=${accessToken}&email=${encodeURIComponent(email)}`);
});

export default router;