"use client";
import { Inter, Jersey_10, Jersey_20, Konkhmer_Sleokchher, Montserrat, Phudu, Poppins, Protest_Strike, Russo_One , Prosto_One, Playfair_Display_SC, Play} from 'next/font/google';
import "./game.css";
import "./globals.css";
import "./shuffle.css";
import ThemeProvider, { useTheme } from '@/context/theme-context';

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
  weight: ['400',"700"],
  subsets: ['latin'],
  variable: '--font-play',
});

const Body = ({ children }: { children: React.ReactNode }) => {
    const theme = useTheme();
    const isDark = theme == "dark";
    return (
      <body className={`${poppins.className} antialiased ${KonkhmerSleokchher.variable} ${jersy2.variable} ${jersy10.variable} ${RussoOne.variable} ${montserrat.variable} ${inter.variable} ${ProtestStrike.variable} ${ProstoOne.variable} ${phudu.variable} ${playfairDisplaySc.variable} ${poppinsVariable.variable} ${play.variable} ${ isDark ? 'dark' : ''}`}>
        {children}
      </body>
    );
  };
  

  export default function BodyComponent ({ children }: { children: React.ReactNode }) {
    return (
    <ThemeProvider>
      <Body>  
        {children}
      </Body>
    </ThemeProvider>
    )
  }