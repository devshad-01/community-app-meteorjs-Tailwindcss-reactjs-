import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

export const Page = ({ 
  title,
  description,
  children,
  actions,
  breadcrumbs,
  containerClass = ''
}) => {
  return (
    <div className={`${containerClass}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && <FiChevronRight className="mx-1 text-muted" />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-sm text-muted">
                    {crumb.label}
                  </span>
                ) : (
                  <Link 
                    to={crumb.href} 
                    className="text-sm text-primary hover:underline"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      {/* Page header */}
      {(title || actions) && (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            {title && <h1 className="text-3xl font-bold">{title}</h1>}
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
          </div>
          
          {description && (
            <p className="text-muted">
              {description}
            </p>
          )}
        </div>
      )}
      
      {/* Page content */}
      {children}
    </div>
  );
};
