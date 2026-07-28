import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Observer } from 'gsap/Observer';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollSmoother,
    DrawSVGPlugin,
    SplitText,
    Flip,
    MotionPathPlugin,
    Observer,
    ScrambleTextPlugin
  );
}

export {
  gsap,
  ScrollTrigger,
  ScrollSmoother,
  DrawSVGPlugin,
  SplitText,
  Flip,
  MotionPathPlugin,
  Observer,
  ScrambleTextPlugin,
};
