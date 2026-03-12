import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTicketAlt, FaMapMarkerAlt, FaCar, FaUser, FaClock, 
  FaCheckCircle, FaDownload, FaTaxi, FaQrcode, FaShieldAlt, FaTimes, FaFileAlt
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const BookingSummary = () => {
  const receiptRef = useRef();
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const bookingData = {
    id: 'TX-992188',
    date: 'March 14, 2026',
    time: '04:30 PM',
    pickup: 'Luxury Hotel, Downtown',
    destination: 'International Airport',
    rideType: 'Shared Ride (2 Seats)',
    vehicle: 'Toyota Camry (White)',
    fare: 124.00,
    tax: 12.40,
    discount: 5.00,
    total: 131.40,
    status: 'Confirmed',
    customer: {
      name: 'John Doe',
      phone: '+1 234 567 890',
      email: 'john.doe@example.com'
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const element = receiptRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        // Force hex colors for html2canvas to avoid oklch issues
        onclone: (clonedDoc) => {
          const receipt = clonedDoc.querySelector('.receipt-card-download');
          if (receipt) {
            receipt.style.fontFamily = 'Inter, sans-serif';
          }
        }
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Taxica_Receipt_${bookingData.id}.pdf`);
      setShowPreview(false);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-20">
      <PageHeader title="Booking Summary" subtitle="Your journey details and digital receipt" />
      
      <div className="container mx-auto px-4 -mt-16 sm:-mt-24 relative z-20">
        <div className="max-w-4xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="print:shadow-none print:m-0"
          >
             {/* The Actual Digital Receipt */}
             <div 
               ref={receiptRef}
               className="bg-white rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100 receipt-card"
             >
                {/* Header: Branding & ID */}
                <div className="bg-[#111111] p-8 sm:p-12 flex flex-col sm:flex-row justify-between items-center gap-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
                   
                   <div className="flex items-center gap-4 relative z-10">
                      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                         <FaTaxi className="text-[#111111] text-2xl" />
                      </div>
                      <div>
                         <h1 className="text-3xl font-black text-white lowercase tracking-tighter leading-none">taxica</h1>
                         <p className="text-primary text-[10px] uppercase font-bold tracking-[0.2em] mt-1">Digital Receipt</p>
                      </div>
                   </div>

                   <div className="text-center sm:text-right relative z-10">
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Booking Identity</div>
                      <div className="text-2xl font-black text-white tracking-widest">{bookingData.id}</div>
                      <div className="flex items-center justify-center sm:justify-end gap-2 text-green-500 text-xs mt-2 font-bold bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                         <FaCheckCircle size={10} /> {bookingData.status}
                      </div>
                   </div>
                </div>

                {/* Main Body */}
                <div className="p-8 sm:p-12 lg:p-16">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                      
                      {/* Left Side: Journey & Customer */}
                      <div className="space-y-12">
                         {/* Journey Details */}
                         <div className="relative">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                               <span className="w-6 h-0.5 bg-primary"></span> Journey Details
                            </h3>
                            
                            <div className="space-y-10 relative">
                               <div className="absolute left-[27px] top-[40px] bottom-[20px] w-[2px] border-l-2 border-dashed border-gray-200"></div>
                               
                               {/* Pickup */}
                               <div className="flex gap-6 relative group">
                                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary border border-gray-100 shrink-0 z-10 group-hover:bg-primary group-hover:text-[#111111] transition-all duration-300">
                                     <FaMapMarkerAlt className="text-xl" />
                                  </div>
                                  <div>
                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Origin (Pickup Location)</p>
                                     <p className="text-lg font-black text-[#111111]">{bookingData.pickup}</p>
                                     <p className="text-xs text-gray-400 mt-1 font-medium">{bookingData.date} @ {bookingData.time}</p>
                                  </div>
                               </div>

                               {/* Drop-off */}
                               <div className="flex gap-6 relative group">
                                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary border border-gray-100 shrink-0 z-10 group-hover:bg-primary group-hover:text-[#111111] transition-all duration-300">
                                     <FaCar className="text-xl" />
                                  </div>
                                  <div>
                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target (Destination)</p>
                                     <p className="text-lg font-black text-[#111111]">{bookingData.destination}</p>
                                     <p className="text-xs text-gray-400 mt-1 font-medium">ETA: ~45 Minutes</p>
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* Customer Info */}
                         <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                               <span className="w-6 h-0.5 bg-primary"></span> Passenger Details
                            </h3>
                            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4">
                               <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-bold text-gray-500 uppercase">Passenger:</span>
                                  <span className="text-sm font-black text-[#111111]">{bookingData.customer.name}</span>
                               </div>
                               <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-bold text-gray-500 uppercase">Contact:</span>
                                  <span className="text-sm font-black text-[#111111]">{bookingData.customer.phone}</span>
                               </div>
                               <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                  <span className="text-[11px] font-bold text-gray-500 uppercase">Vehicle:</span>
                                  <span className="text-sm font-black text-primary">{bookingData.vehicle}</span>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Right Side: Price Breakdown & QR */}
                      <div className="flex flex-col h-full">
                         <div className="flex-grow">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                               <span className="w-6 h-0.5 bg-primary"></span> Billing Summary
                            </h3>
                            
                            <div className="space-y-4">
                               <div className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors rounded-2xl">
                                  <span className="text-sm font-bold text-gray-500">Base Fare ({bookingData.rideType})</span>
                                  <span className="text-lg font-black text-[#111111]">${bookingData.fare.toFixed(2)}</span>
                               </div>
                               <div className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors rounded-2xl">
                                  <span className="text-sm font-bold text-gray-500">VAT / Service Tax (10%)</span>
                                  <span className="text-lg font-black text-[#111111]">+${bookingData.tax.toFixed(2)}</span>
                               </div>
                               <div className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors rounded-2xl">
                                  <span className="text-sm font-bold text-gray-500">Applied Discount</span>
                                  <span className="text-lg font-black text-green-500">-${bookingData.discount.toFixed(2)}</span>
                               </div>
                               
                               <div className="mx-4 mt-8 pt-8 border-t-2 border-[#111111] flex justify-between items-center">
                                  <div>
                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">TOTAL PAYABLE</p>
                                     <p className="text-5xl font-black text-[#111111] tracking-tighter">${bookingData.total.toFixed(2)}</p>
                                  </div>
                                  <div className="w-24 h-24 bg-white p-2 rounded-2xl border-2 border-[#111111]/5 flex items-center justify-center hover:scale-105 transition-transform cursor-help">
                                     <FaQrcode className="text-5xl text-[#111111]" />
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* Security Shield */}
                         <div className="mt-16 flex items-center gap-4 p-5 bg-primary/5 rounded-3xl border border-primary/10">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-[#111111] shadow-lg shadow-primary/10">
                               <FaShieldAlt />
                            </div>
                            <p className="text-[11px] font-bold text-gray-500 leading-tight">
                               This is a system generated digital receipt and doesn't require a physical signature. Safe & Secure.
                            </p>
                         </div>
                      </div>

                   </div>
                </div>

                {/* Action Bar */}
                <div className="p-8 sm:p-12 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6 print:hidden">
                   <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setShowPreview(true)}
                        className="flex items-center gap-3 px-8 py-5 bg-[#111111] text-white hover:bg-primary hover:text-[#111111] transition-all rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 group"
                      >
                         <FaFileAlt className="text-primary group-hover:text-[#111111]" /> PREVIEW & DOWNLOAD RECEIPT
                      </button>
                   </div>

                   <Link 
                     to="/profile" 
                     className="flex items-center gap-3 px-10 py-5 bg-white border-2 border-primary text-[#111111] hover:bg-primary transition-all rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95"
                   >
                      GO TO DASHBOARD
                   </Link>
                </div>
             </div>
          </motion.div>

          <p className="mt-12 text-center text-gray-400 font-medium max-w-lg mx-auto leading-relaxed print:hidden">
             A copy of this digital receipt has been sent to <span className="text-[#111111] font-bold">john.doe@example.com</span>.
          </p>
        </div>
      </div>

      {/* Receipt Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 lg:p-10"
          >
            <div className="absolute inset-0 bg-[#111111]/90 backdrop-blur-md" onClick={() => setShowPreview(false)}></div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 sm:px-10 border-b border-gray-100 bg-white sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <FaDownload />
                  </div>
                  <h3 className="text-lg font-black text-[#111111] uppercase tracking-tight">Receipt Preview</h3>
                </div>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-red-500 hover:text-white transition-all rounded-full flex items-center justify-center text-gray-500"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Modal Body - Scrolable Receipt */}
              <div className="flex-grow overflow-y-auto p-4 sm:p-10 bg-gray-100">
                <div className="max-w-[800px] mx-auto scale-95 sm:scale-100 origin-top">
                  {/* Using explicit hex colors in styles to bypass oklch issues */}
                  <div 
                    ref={receiptRef}
                    className="receipt-card-download bg-white overflow-hidden shadow-xl"
                    style={{ backgroundColor: '#ffffff', color: '#111111' }}
                  >
                     {/* Header: Branding & ID */}
                     <div style={{ backgroundColor: '#111111', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                        <div className="flex items-center gap-4">
                           <div style={{ backgroundColor: '#FFC107', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="flex items-center justify-center">
                              <FaTaxi style={{ color: '#111111', fontSize: '24px' }} />
                           </div>
                           <div>
                              <h1 style={{ color: '#ffffff', fontSize: '28px', fontWeight: '900', margin: '0' }}>taxica</h1>
                              <p style={{ color: '#FFC107', fontSize: '10px', textTransform: 'uppercase', fontWeight: '800', margin: '4px 0 0' }}>Digital Receipt</p>
                           </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                           <p style={{ color: '#666666', fontSize: '10px', fontWeight: '900', margin: '0' }}>BOOKING ID</p>
                           <p style={{ color: '#ffffff', fontSize: '20px', fontWeight: '900', margin: '0' }}>{bookingData.id}</p>
                        </div>
                     </div>

                     {/* Main Content */}
                     <div style={{ padding: '60px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                           {/* Left */}
                           <div>
                              <h4 style={{ color: '#999999', fontSize: '10px', textTransform: 'uppercase', marginBottom: '20px' }}>Journey Details</h4>
                              <div style={{ marginBottom: '30px' }}>
                                 <p style={{ color: '#111111', fontSize: '14px', fontWeight: '900', marginBottom: '5px' }}>PICKUP LOCATION</p>
                                 <p style={{ color: '#555555', fontSize: '14px', margin: '0' }}>{bookingData.pickup}</p>
                              </div>
                              <div style={{ marginBottom: '30px' }}>
                                 <p style={{ color: '#111111', fontSize: '14px', fontWeight: '900', marginBottom: '5px' }}>DESTINATION</p>
                                 <p style={{ color: '#555555', fontSize: '14px', margin: '0' }}>{bookingData.destination}</p>
                              </div>
                              <div style={{ paddingTop: '20px', borderTop: '1px solid #eeeeee' }}>
                                 <p style={{ color: '#111111', fontSize: '14px', fontWeight: '900' }}>VEHICLE: <span style={{ color: '#FFC107' }}>{bookingData.vehicle}</span></p>
                              </div>
                           </div>

                           {/* Right */}
                           <div style={{ backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '20px' }}>
                              <h4 style={{ color: '#999999', fontSize: '10px', textTransform: 'uppercase', marginBottom: '20px' }}>Billing Summary</h4>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                 <span style={{ fontSize: '13px', fontWeight: '600' }}>Amount</span>
                                 <span style={{ fontSize: '13px', fontWeight: '800' }}>${bookingData.fare.toFixed(2)}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                 <span style={{ fontSize: '13px', fontWeight: '600' }}>Tax (10%)</span>
                                 <span style={{ fontSize: '13px', fontWeight: '800' }}>+${bookingData.tax.toFixed(2)}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#10b981' }}>
                                 <span style={{ fontSize: '13px', fontWeight: '600' }}>Discount</span>
                                 <span style={{ fontSize: '13px', fontWeight: '800' }}>-${bookingData.discount.toFixed(2)}</span>
                              </div>
                              <div style={{ paddingTop: '20px', borderTop: '2px solid #111111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <div>
                                    <p style={{ fontSize: '9px', fontWeight: '900', margin: '0' }}>TOTAL PAID</p>
                                    <p style={{ fontSize: '32px', fontWeight: '900', margin: '0', color: '#111111' }}>${bookingData.total.toFixed(2)}</p>
                                 </div>
                                 <FaQrcode style={{ fontSize: '50px', color: '#111111' }} />
                              </div>
                           </div>
                        </div>
                        
                        <div style={{ marginTop: '40px', textAlign: 'center', padding: '20px', backgroundColor: '#fffbeb', borderRadius: '15px', color: '#d97706', fontSize: '12px', fontWeight: '700' }}>
                           Ride Status: {bookingData.status} | Verified Digitally by Taxica Fleet Systems
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 sm:px-10 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-gray-400 font-medium">Verify your details before downloading the PDF.</p>
                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-primary hover:bg-[#111111] hover:text-white transition-all rounded-2xl font-black text-xs uppercase tracking-widest text-[#111111] shadow-xl shadow-primary/20 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <>Generatng PDF...</>
                  ) : (
                    <><FaDownload /> DOWNLOAD PDF NOW</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-card, .receipt-card * {
            visibility: visible;
          }
          .receipt-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            border: none !important;
          }
          .print:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingSummary;
