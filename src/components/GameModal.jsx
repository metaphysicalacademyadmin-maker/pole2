import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const SYS = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

/**
 * Спільна обгортка для модалок гри. Всі ігрові модалки мають іти через неї,
 * щоб close-icon, шрифт, золотий колір, fullscreen на мобільному і `dividers`
 * у контенті були гарантовані в кожному екземплярі.
 *
 * Проблема, яку розв'язує: раніше кожна модалка копіювала один і той самий
 * `<Dialog>+<DialogTitle>` патерн і всі 8 з 9 забували про close-icon.
 * Якщо побачиш у новій модалці голий `<Dialog>` — переведи на GameModal.
 *
 * Mobile (≤ md / 900px):
 *   • fullScreen — модалка займає весь viewport
 *   • заголовок 16px замість 1.25rem (≈20px), wrap у 2 рядки якщо довгий —
 *     щоб не наїжджав на іконку закриття × у правому куті
 *
 * @param {boolean}    open        — стан відкриття
 * @param {() => void} onClose     — закриття (зовнішній клік + ×)
 * @param {string|ReactNode} title — текст заголовку АБО jsx (icon+text)
 * @param {string}     titleColor  — колір заголовку, default '#f0c574'
 * @param {string}     maxWidth    — 'xs' | 'sm' | 'md' | 'lg', default 'sm' (ігнорується на мобільному)
 * @param {boolean}    fullWidth   — default true
 * @param {boolean}    dividers    — лінії між title/content/actions, default true
 * @param {ReactNode}  children    — вміст
 */
export default function GameModal({
  open,
  onClose,
  title,
  titleColor = '#f0c574',
  maxWidth = 'sm',
  fullWidth = true,
  dividers = true,
  children,
}) {
  const theme = useTheme();
  // Mobile breakpoint — за замовчуванням MUI це <900px (theme.breakpoints.down('md'))
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isMobile ? false : maxWidth}
      fullWidth={fullWidth}
      fullScreen={isMobile}
    >
      <DialogTitle
        sx={{
          fontFamily: SYS,
          fontWeight: 700,
          color: titleColor,
          display: 'flex',
          alignItems: 'flex-start', // top-align щоб довгий title не «стрибав» через size кнопки
          justifyContent: 'space-between',
          gap: '12px',
          pr: 1,
          fontSize: { xs: '0.95rem', md: '1.25rem' }, // мобільне зменшення
          lineHeight: { xs: 1.3, md: 1.6 },
          py: { xs: 1.25, md: 2 },
        }}
      >
        {/* Title slot — можна string або складний JSX. На мобільному — wrap. */}
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: 1,
            minWidth: 0,
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
          }}
        >
          {title}
        </span>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="закрити"
          sx={{
            color: titleColor,
            flexShrink: 0,
            // На мобільному робимо кнопку трохи меншою щоб не з'їдати title-простір
            mt: { xs: '-2px', md: 0 },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={dividers}>{children}</DialogContent>
    </Dialog>
  );
}
