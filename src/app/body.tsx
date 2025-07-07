"use client";
import { useTheme } from '@/context/theme-context';
import { Inter, Jersey_10, Jersey_20, Konkhmer_Sleokchher, Montserrat, Poppins, Russo_One } from 'next/font/google';
import "./game.css";
import "./globals.css";
import "./shuffle.css";

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

const KonkhmerSleokchher = Konkhmer_Sleokchher({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-konkhmer-sleokchher',
});


const jersy2 = Jersey_20({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-jersy-20',
});

const jersy10 = Jersey_10({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-jersy-10',
});

const RussoOne = Russo_One({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-russo-one',
});

const montserrat = Montserrat({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-inter',
});


const Body = ({ children }: { children: React.ReactNode }) => {
    const theme = useTheme();
    const isDark = theme === "dark";
    return (
      <body className={`${poppins.className} antialiased ${KonkhmerSleokchher.variable} ${jersy2.variable} ${jersy10.variable} ${RussoOne.variable} ${montserrat.variable} ${inter.variable} ${isDark ? 'dark' : ''}`}>
        {children}
      </body>
    );
  };
  
  export default Body;