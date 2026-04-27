import jwt from 'jsonwebtoken';
const createTokenPair = async ({
  payload,
  publicKey,
  privateKey,
}: { payload: any; publicKey: string; privateKey: string }) => {
  try {
    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: '2 days',
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: '7 days',
    });

    /* vì đây là cặp keys bất đối xứng, nên có thể sử dụng đẻ mã hoá */
    jwt.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.error('Access token verification failed:', err);
      } else {
        console.log('Access token decoded successfully:', decoded);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error creating token pair:', error);
    return null;
  }
};

export { createTokenPair };
