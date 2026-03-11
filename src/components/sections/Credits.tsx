import { useTheme } from '../../lib/theme';
const Credits = () => {
  const { isDark } = useTheme();
  return (
    <p className='py-4 text-center text-[10px] text-muted-foreground'>
      <a
        href='https://www.linkedin.com/in/juan-jos%C3%A9-arana-fu-136b6920a/'
        target='_blank'
        rel='noreferrer'
        className={
          isDark
            ? 'hover:text-primary'
            : 'hover:text-foreground transition-colors'
        }
      >
        Created by <span className='font-semibold'>JFoo</span>
      </a>
    </p>
  );
};

export default Credits;
