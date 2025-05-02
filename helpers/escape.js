// Helper function to escape HTML
const escape = (unsafe) => {
  return (unsafe === null) ? null : 
    unsafe.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

export default escape; 