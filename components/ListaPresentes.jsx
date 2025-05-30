import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const gifts = [
  { id: 1, name: 'Panela de Arroz Elétrica', price: 2500, image: '/gifts/panela.png' },
  { id: 2, name: 'Liquidificador Turbo', price: 1800, image: '/gifts/liquidificador.png' },
  { id: 3, name: 'Jantar Romântico', price: 4000, image: '/gifts/jantar.png' },
];

export default function ListaPresentes() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (gift) => {
    setLoading(true);
    const stripe = await stripePromise;

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: gift }),
    });

    if (!response.ok) {
      alert('Erro ao iniciar pagamento. Tente novamente.');
      setLoading(false);
      return;
    }

    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">🎁 Lista de Presentes dos Noivos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gifts.map((gift) => (
          <motion.div
            key={gift.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* <Card className="rounded-2xl shadow-lg"> */}
            <div className="rounded-2xl shadow-lg bg-white">
              <img src={gift.image} alt={gift.name} className="w-full h-48 object-cover rounded-t-2xl" />
              {/* <CardContent className="p-4 flex flex-col items-center"> */}
              <div className="p-4 flex flex-col items-center">
                <h2 className="text-xl font-semibold text-center mb-2">{gift.name}</h2>
                <p className="text-sm text-gray-500 mb-4">R$ {(gift.price / 100).toFixed(2)}</p>
                <button
                  onClick={() => handleCheckout(gift)}
                  disabled={loading}
                  className="bg-pink-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-pink-600 transition"
                >
                  Presentear 🎉
                </button>
                {/* <Button onClick={() => handleCheckout(gift)} disabled={loading}>
                  Presentear 🎉
                </Button> */}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}