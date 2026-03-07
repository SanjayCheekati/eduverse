import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const AnimatedCounter = ({ end, duration = 2.5, prefix = '', suffix = '', decimals = 0, className = '' }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <span ref={ref} className={className}>
      {inView ? (
        <CountUp end={end} duration={duration} prefix={prefix} suffix={suffix} decimals={decimals} separator="," />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
};

export default AnimatedCounter;
