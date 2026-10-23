import { Coins, Landmark, Smartphone, WalletCards } from "lucide-react";

const METHOD_ICONS = {
  bank_transfer: Landmark,
  upi: Smartphone,
  cryptapi: Coins,
  wallet_address: WalletCards,
};

export default function PaymentMethodIcon({ methodId, size = 19 }) {
  const Icon = METHOD_ICONS[methodId] || WalletCards;
  return <Icon size={size} aria-hidden="true" />;
}
