const EmailPage = () => {
  const openGmail = () => {
    window.open('https://mail.google.com/mail/u/0/#all', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div
        className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl max-w-4xl w-full p-8
                   animate-fadeIn slideUp"
      >
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white select-none">
            📧 Email Dashboard
          </h1>

          <button
            onClick={openGmail}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg
                       transition-colors duration-300 font-semibold select-none"
          >
            Open Gmail
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
              Inbox Overview
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              You currently have <b>27 unread emails</b> in your inbox.
            </p>
          </div>

          <div className="p-6 bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg">
            <h2 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
              Last Synced
            </h2>
            <p className="text-gray-700 dark:text-gray-300">Last Gmail sync: <b>2 minutes ago</b>.</p>
          </div>

          <div className="p-6 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg md:col-span-2">
            <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
              Status
            </h2>
            <p className="text-gray-700 dark:text-gray-200">
              <b>Status:</b> Assigned but not started yet. Please review your inbox for new tasks and
              assignments.
            </p>
          </div>
        </section>
      </div>
<style>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes slideUp {
    from {
      transform: translateY(20px);
    }
    to {
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.7s ease forwards;
  }
  .slideUp {
    animation: slideUp 0.7s ease forwards;
  }
`}</style>

    </div>
  )
}

export default EmailPage
