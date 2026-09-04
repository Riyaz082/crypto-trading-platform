import { Link } from "@tanstack/react-router";
import { TrendingUp, Twitter, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold mb-4">
              <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="gradient-text">Crypto Trading Platform</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              A modern cryptocurrency trading platform that enables users to monitor market trends, execute trades, manage portfolios, and analyze real-time cryptocurrency data.
            </p>
            <div className="flex gap-3 mt-5">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 grid place-items-center rounded-lg bg-surface hover:bg-primary/20 transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Product", links: ["Markets", "Wallet", "Portfolio", "API"] },
            { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
            { title: "Legal", links: ["Terms", "Privacy", "Cookies", "Compliance"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-foreground transition">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Crypto Trading Platform Labs. All rights reserved.</div>
          <div>Made with precision for traders worldwide.</div>
        </div>
      </div>
    </footer>
  );
}
