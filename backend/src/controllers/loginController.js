import jwt from "jsonwebtoken";

export const allowAccess = async (req, res) => {
  try {
    const {name, password} = req.body;
    if (!name || !password) return res.status(400).json({message: "Nome e senha são obrigatórios."});
    if (password !== process.env.CHAT_PASSWORD) return res.status(403).json({message: "Senha errada."});

    const randomHex = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;

    const user = {name, color: randomHex()};
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({token});

  } catch (e) {
    return res.status(500).json({message: "Erro no servidor entrar na conta."});
  }
}
