import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Is Crypto Trading Platform safe for storing crypto?", a: "Yes — Crypto Trading Platform uses JWT-based auth, encrypted at-rest storage, hardware-backed key custody, and 2FA for all sensitive operations." },
  { q: "How fast are deposits and withdrawals?", a: "Deposits credit in real-time after on-chain confirmation. Withdrawals are reviewed by our admin pipeline and typically settle in under 30 minutes." },
  { q: "Do you offer an API?", a: "Yes. Our REST API follows the standard Spring Boot error envelope and supports all trading, wallet, and portfolio operations with bearer-token auth." },
  { q: "What fees do you charge?", a: "0.10% maker / 0.15% taker on all spot trades. Wallet transfers between Crypto Trading Platform users are free." },
  { q: "How does the demo payment gateway work?", a: "We ship a sandbox payment redirect so you can simulate deposit success/failure flows end-to-end without real funds." },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">
            Frequently <span className="gradient-text">asked</span>
          </h2>
        </div>
        <div className="max-w-3xl mx-auto glass rounded-2xl p-2 sm:p-4">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/50">
                <AccordionTrigger className="text-left text-base font-semibold px-3">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="px-3 text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
