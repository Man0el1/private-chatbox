import jwt from 'jsonwebtoken';

export const validateToken = async (req, res) => {
  try {
    const {token} = req.body;
    if (!token) return res.status(400).json({message: "Token é obrigatório."});

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({message: "Token inválido."});

    return res.status(200).json({message: "Token válido."});
  } catch (e) {
    return res.status(500).json({message: "Erro no servidor validar token."});
  }
}
