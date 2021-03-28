let contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    fetch(contactForm.getAttribute('action'), {
      method: 'POST',
      headers: {
      'Accept': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: new URLSearchParams(formData).toString()
    })
    .then(res => {
      if (res) {
        contactForm.parentNode.innerHTML = '<div role="alert"><h2>Message sent</h2><p><strong>Thank you for your enquiry. I will get back to you ASAP.</strong></p></div>';
        // if (navigator.vibrate) {
        //   navigator.vibrate(200);
        // }
      }
    });
  });
}