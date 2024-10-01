import React from 'react';
import { Link } from 'react-router-dom';
import './Banner.css';

const BannerSmall = ({ bannerTitle, bannerImage, breadcrumbs = []}) => {
return (
// <div className="banner banner-small">
//     <h1 className="banner-title">{bannerText}</h1>
// </div>
<div className="banner-small" style={{ backgroundImage: `url(${bannerImage})` }}>
    <div className="banner-content">
        <h1 className="banner-small-title">{bannerTitle}</h1>

        {/* Breadcrumb Navigation (optional) */}
        {breadcrumbs.length > 0 && (
            <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center">
                {breadcrumbs.map((breadcrumb, index) => (
                <li
                    key={index}
                    className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                    aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                >
                    {index === breadcrumbs.length - 1 ? (
                    breadcrumb.label // If it's the last breadcrumb, show it as plain text
                    ) : (
                    <Link to={breadcrumb.link}>{breadcrumb.label}</Link> // Else, show it as a link
                    )}
                </li>
                ))}
            </ol>
            </nav>
        )}
    </div>
</div>
);};

export default BannerSmall;