import { Link } from '@inertiajs/react';
import { type PaginationLink } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    links: PaginationLink[];
}

export default function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            {links.map((link, index) => {
                const isFirst = index === 0;
                const isLast = index === links.length - 1;
                const isActive = link.active;
                const isDisabled = !link.url;

                let label = link.label;
                let icon = null;

                if (isFirst) {
                    icon = <ChevronLeft className="h-4 w-4" />;
                    label = '';
                } else if (isLast) {
                    icon = <ChevronRight className="h-4 w-4" />;
                    label = '';
                }

                const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 min-w-9';

                const activeClasses = isActive
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300';

                const disabledClasses = isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : '';

                if (isDisabled || !link.url) {
                    return (
                        <span
                            key={index}
                            className={`${baseClasses} ${activeClasses} ${disabledClasses}`}
                        >
                            {icon ? icon : <span dangerouslySetInnerHTML={{ __html: label }} />}
                        </span>
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`${baseClasses} ${activeClasses}`}
                        preserveScroll
                        preserveState
                    >
                        {icon ? icon : <span dangerouslySetInnerHTML={{ __html: label }} />}
                    </Link>
                );
            })}
        </div>
    );
}
