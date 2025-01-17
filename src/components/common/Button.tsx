interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  width?: string;
  children: React.ReactNode;
}

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  width = 'w-[100px]',
  children, 
  className,
  ...props 
}: ButtonProps) => {
  const baseStyles = "font-bold rounded";
  
  const variantStyles = {
    primary: "bg-blue-500 text-white",
    secondary: "border-2 border-black text-black",
    danger: "bg-red-500 text-white"
  };
  
  const sizeStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2",
    lg: "px-4 py-3 text-lg"
  };

  return (
    <button 
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${width}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 