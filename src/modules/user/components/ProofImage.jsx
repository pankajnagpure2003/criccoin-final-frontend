import { useEffect, useState } from "react";
import { getWithdrawalProof } from "../api/withdrawal.api.js";

export default function ProofImage({ id, loader = getWithdrawalProof }) {
  const [src, setSrc] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let url = "";
    let active = true;
    loader(id)
      .then((blob) => {
        url = URL.createObjectURL(blob);
        if (active) {
          setSrc(url);
        }
      })
      .catch(() => {
        if (active) {
          setFailed(true);
        }
      });
    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [id, loader]);

  if (!src) {
    return <p className="muted">{failed ? "Payment screenshot is unavailable." : "Loading screenshot..."}</p>;
  }

  return (
    <a href={src} target="_blank" rel="noreferrer">
      <img className="proof-shot" src={src} alt="Payment screenshot" />
    </a>
  );
}
