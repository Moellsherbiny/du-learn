import Link from 'next/link'
import { Brand } from './brand'

function PublicFooter() {
  return (
      <footer className="border-t border-border/60">
        <div className="mx-auto flex  flex-col gap-4 px-6 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Brand isDashboard/>
          <p>&copy; {new Date().getFullYear()} DU Learn</p>

          <div className="flex items-center gap-5">
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              الشروط والأحكام
            </Link>

            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              سياسة الخصوصية
            </Link>
          </div>
        </div>
      </footer>
  )
}

export default PublicFooter