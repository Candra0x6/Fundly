import React from 'react'

function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold">FND</span>
              </div>
              <span className="font-semibold text-xl text-white">Fundify</span>
            </div>
            <p className="text-sm mb-4">
              Connecting MSMEs with investors through tokenized revenue sharing opportunities.
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  For MSMEs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  For Investors
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Verification Process
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Partnerships
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-12 pt-8 text-sm text-center">
          <p>© 2025 Fundify. All rights reserved.</p>
        </div>
      </div>
    </footer>)
}

export default Footer