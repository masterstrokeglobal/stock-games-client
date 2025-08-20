"use client";
import ThemeProvider, { useTheme } from '@/context/theme-context';
import { Audiowide, Inter,Quantico, Jersey_10, Jersey_20, Wendy_One, Konkhmer_Sleokchher, Montserrat, Orbitron, Phudu, Play, Playfair_Display_SC, Poppins, Prosto_One, Protest_Strike, Rajdhani, Russo_One, Space_Grotesk, Space_Mono } from 'next/font/google';
import "./game.css";
import "./globals.css";
import "./shuffle.css";

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

const poppinsVariable = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
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

const ProtestStrike = Protest_Strike({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-protest-strike',
});

const ProstoOne = Prosto_One({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-prosto-one',
});

const phudu = Phudu({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-phudu',
});

const playfairDisplaySc = Playfair_Display_SC({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-playfair-display-sc',
});

const play = Play({
  weight: ['400', "700"],
  subsets: ['latin'],
  variable: '--font-play',
});

const AudioWide = Audiowide({
  weight: ['400'],
  subsets: ['latin'],
  variable: "--font-audiowide"
})
const SpaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-spacemono'
})

const OrbitronFont = Orbitron({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-orbitron'
})

const spacegrotesk = Space_Grotesk({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: "--font-space-grotesk"
});

const RajdhaniFont = Rajdhani({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rajdhani'
});

const quantico = Quantico({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-quantico'
});


const wendyOne = Wendy_One({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-wendy-one'
});


const Body = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const isDark = theme == "dark";
  return (
    <body className={`${poppins.className} antialiased ${KonkhmerSleokchher.variable} ${jersy2.variable} ${jersy10.variable} ${RussoOne.variable} ${AudioWide.variable} ${montserrat.variable} ${inter.variable} ${ProtestStrike.variable} ${ProstoOne.variable} ${phudu.variable} ${playfairDisplaySc.variable} ${poppinsVariable.variable} ${play.variable} ${SpaceMono.variable} ${OrbitronFont.variable} ${spacegrotesk.variable}  ${RajdhaniFont.variable} ${quantico.variable} ${wendyOne.variable} ${isDark ? 'dark' : ''}`}>
      {children}
    </body>
  );
};


export default function BodyComponent({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Body>
        {children}
      </Body>
    </ThemeProvider>
  )
}