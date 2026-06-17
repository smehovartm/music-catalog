'use client';
import { useState, useEffect } from 'react';

interface ActionButtonProps {
  onDelete?: () => Promise<void> | void;
  onEdit?: () => Promise<void> | void;
  confirmMessage?: string;
  type?: 'delete' | 'edit';
}

export default function ActionButton({
  onDelete,
  onEdit,
  confirmMessage = 'Удалить?',
  type = 'delete',
}: ActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = async () => {
    if (type === 'delete' && onDelete) {
      setIsActive(true);
      setTimeout(async () => {
        if (!confirm(confirmMessage)) {
          setIsActive(false);
          return;
        }
        await onDelete();
        setIsActive(false);
      }, 200);
    } else if (type === 'edit' && onEdit) {
      setIsActive(true);
      setTimeout(async () => {
        await onEdit();
        setIsActive(false);
      }, 200);
    }
  };

  const showHover = !isMobile && isHovered;

  return (
    <div>
      <div
        className="absolute top-0 right-0 h-full transition-all duration-500"
        style={{
          width: isActive ? '100%' : (showHover ? '40%' : '0%'),
          background: type === 'delete'
            ? 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(230,30,30) 100%)'
            : 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(255,200,0) 100%)',
        }}
      />
      
      <div className="relative z-10">
        <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          className="rounded-lg h-8 border bg-gray-100 border-gray-300 overflow-hidden flex items-center gap-2 px-1 transition-all duration-400 ease-in-out"
          style={{
            width: showHover ? (type === 'delete' ? '105px' : '155px') : '32px'
          }}
        >
          <span style={{ fontSize: type === 'delete' ? '16px' : '18px' }}>
            {type === 'delete' ? '🗑️' : '✏️'}
          </span>
          <span className="whitespace-nowrap">
            {type === 'delete' ? 'Удалить' : 'Редактировать'}
          </span>
        </button>
      </div>
    </div>
  );
}