const Privacy = () => {
    return (
        <>
            <div className="container mx-auto py-10 px-4">
                <div className="rounded-xl border text-card-foreground shadow-md bg-card">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <div className="tracking-tight text-2xl font-bold text-foreground">Privacy Policy</div>
                        <p className="text-sm text-muted-foreground">Last Updated: November 17, 2024</p>
                    </div>
                    <div className="p-6 pt-0 space-y-6">
                        <section>
                            <h2 className="text-lg font-semibold text-foreground">1. Introduction</h2>
                            <p className="text-card-foreground">Welcome to <strong>Jayant-Website</strong>. We are committed to protecting your privacy and ensuring that your personal information is handled safely and responsibly. This Privacy Policy outlines how we collect, use, and protect your data.</p>
                        </section>
                        <section>
                            <h2 className="text-lg font-semibold text-foreground">2. How We Protect Your Data</h2>
                            <p className="text-card-foreground">We implement appropriate technical and organizational measures to protect your
                                personal information from unauthorized access, alteration, or disclosure. These include secure servers,
                                encrypted payment processing, and regular security assessments.</p>
                        </section>
                        <section>
                            <h2 className="text-lg font-semibold text-foreground">3. Sharing Your Information</h2>
                            <p className="text-card-foreground">We do not sell, rent, or trade your personal information. However, we may share
                                your data with trusted third parties for the following purposes:</p>
                            <ul className="list-disc pl-6 space-y-1 text-card-foreground">
                                <li>Payment processors to facilitate transactions.</li>
                                <li>Service providers to help us deliver and improve our website.</li>
                                <li>Legal authorities if required to comply with applicable laws or regulations.</li>
                            </ul>
                        </section>
                        <section>
                            <h2 className="text-lg font-semibold text-foreground">4. Cookies and Tracking</h2>
                            <p className="text-card-foreground">We do not use cookies to improve your experience on our website. </p>
                        </section>
                        <section>
                            <h2 className="text-lg font-semibold text-foreground">5. Changes to This Privacy Policy</h2>
                            <p className="text-card-foreground">We may update this Privacy Policy from time to time. Any changes will be posted
                                on this page with the updated date. Please review this page periodically to stay informed.</p>
                        </section>
                        <section>
                            <h2 className="text-lg font-semibold text-foreground">6. Contact Us</h2>
                            <p className="text-card-foreground">If you have any questions or concerns about this Privacy Policy, feel free to
                                contact us:</p>
                        </section>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Privacy;