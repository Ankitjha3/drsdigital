"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-[#111] text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            DRS Digital
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/shop" className="hover:text-gray-300 transition">
              Shop
            </Link>
            <Link href="/about" className="hover:text-gray-300 transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-gray-300 transition">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-gray-300 transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition">
              Terms
            </Link>
            {session ? (
              <>
                <Link href="/my-purchases" className="hover:text-gray-300 transition">
                  My Purchases
                </Link>
                {session.user.isAdmin && (
                  <Link href="/admin" className="hover:text-gray-300 transition">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="hover:text-gray-300 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="hover:text-gray-300 transition">
                Sign In
              </Link>
            )}
            <Link href="/cart" className="relative">
              <svg
                className="w-6 h-6 hover:text-gray-300 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
            <button className="hover:text-gray-300 transition">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4">
            <Link
              href="/shop"
              className="block py-2 hover:text-gray-300 transition"
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block py-2 hover:text-gray-300 transition"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-2 hover:text-gray-300 transition"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className="block py-2 hover:text-gray-300 transition"
              onClick={() => setMenuOpen(false)}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="block py-2 hover:text-gray-300 transition"
              onClick={() => setMenuOpen(false)}
            >
              Terms
            </Link>
            {session ? (
              <>
                <Link
                  href="/my-purchases"
                  className="block py-2 hover:text-gray-300 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  My Purchases
                </Link>
                {session.user.isAdmin && (
                  <Link
                    href="/admin"
                    className="block py-2 hover:text-gray-300 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="block py-2 hover:text-gray-300 transition w-full text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="block py-2 hover:text-gray-300 transition"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
            <Link
              href="/cart"
              className="block py-2 hover:text-gray-300 transition"
              onClick={() => setMenuOpen(false)}
            >
              Cart
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

