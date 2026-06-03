interface Props {
  application: any;
}

export default function SmartRideCard({
  application,
}: Props) {
  return (
    <div className="bg-slate-100 p-10">
      <div className="flex gap-10">
        {/* ========================= */}
        {/* FRONT SIDE */}
        {/* ========================= */}

        <div className="relative w-[520px] h-[320px] overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white">

          {/* Decorative Circle */}
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-white/10" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/10" />

          {/* Header */}
          <div className="relative z-10 px-1 py-2 border-b border-white/20 text-center">
            <h1 className="text-xl font-bold opacity-80">
              SmartRide | Bus Concession Card 
            </h1>

            <p className="text-lg opacity-80">
              HP Government Transport Service
            </p>

          </div>

          {/* Main Content */}
          <div className="relative z-10 flex gap-4 p-4">

            {/* Photo */}
            <div>
              <img
                src={application.photoUrl}
                alt="Photo"
                className="
  w-24
  h-35
  rounded-xl
  border-2
  border-white
  object-cover
"
              />
            </div>

            {/* Details */}
            <div className="flex-1 mb-5">

              <div className="grid grid-cols-2  text-lg opacity-80">
                 <div>
                  <span className="font-semibold">
                    Card Holder:
                  </span>
                </div>
                <p className="text-lg font-bold opacity-80">
                  {application.fullName}
                </p>

                <div>
                  <span className="font-semibold">
                    Card No:
                  </span>
                </div>

                <div>
                  {application.applicationNumber}
                </div>

                <div>
                  <span className="font-semibold">
                    District:
                  </span>
                </div>

                <div>
                  {application.district}
                </div>

                <div>
                  <span className="font-semibold">
                    Gender:
                  </span>
                </div>

                <div>
                  {application.gender}
                </div>

                <div>
                  <span className="font-semibold">
                    Phone:
                  </span>
                </div>

                <div>
                  {application.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Area */}
          {/* Bottom Area */}
<div className="absolute bottom-5 left-6 right-6 flex justify-between items-end">

  {/* Validity */}
  <div>
    <p className="text-lg opacity-80">
      Valid Till
    </p>

    <p className="text-lg opacity-80">
      {application.validTill
        ? new Date(
            application.validTill
          ).toLocaleDateString()
        : "N/A"}
    </p>
  </div>

  {/* Signature */}
  <div className="flex flex-col items-center">
    <img
      src={application.signatureUrl}
      alt="Signature"
      className="
        w-32
        h-12
        object-contain
        mix-blend-multiply
      "
    />

    <div className="w-28 border-b border-white/50 mt-1" />

    <p className="text-xs mt-1 opacity-80">
      Signature
    </p>
  </div>

</div>
        </div>

        {/* ========================= */}
        {/* BACK SIDE */}
        {/* ========================= */}

      <div className="
  relative
  w-[520px]
  h-[320px]
  overflow-hidden
  rounded-3xl
  shadow-2xl
  bg-gradient-to-r
  from-blue-700
  via-blue-600
  to-cyan-500
  text-white
">

{/* Decorative circles */}

  <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-white/10" />

  <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/10" />

{/* Header */}

 <div className="relative z-10 px-1 py-2 border-b border-white/20 text-center">
            <h1 className="text-xl font-bold opacity-80">
              SmartRide | Bus Concession Card 
            </h1>

            <p className="text-lg opacity-80">
              HP Government Transport Service
            </p>

          </div>

{/* Content */}

  <div className="relative z-10 p-6">


{/* Address */}
<div className="mb-0 flex-1">
  
<h3 className="text-lg mb-1 opacity-80">
    Address: {application.address}
  </h3>
</div>

{/* Aadhaar */}
<div className="mb-1">
  <h3 className="text-lg mb-2 opacity-80">
    Aadhaar Number: XXXXXXXX
    {application.aadharNumber?.slice(-4)}
  </h3>
</div>

{/* Terms */}
<div>
  <h3 className="font-bold text-lg mb-2 opacity-80">
    Terms & Conditions
  </h3>

  <ul className="space-y-1 text-xs opacity-80">

    <li>
      • Carry valid ID proof while travelling.
    </li>

    <li>
      • Misuse may result in cancellation.
    </li>
  </ul>
</div>
<div>

  <p className="font-semibold opacity-80 mt-4">
    www.smartride.in
  </p>
</div>


  </div>

{/* Footer */}

  <div
    className="
      absolute
      bottom-6
      left-85
      right-6
      flex
      justify-between
      items-center
    "
  >

<div
  className="
    w-40
    h-40
    rounded-lg
    bg-white
    flex
    items-center
    justify-center
    text-black
    text-xs
    font-semibold
  "
>
  QR
</div>


  </div>

</div>

      </div>
    </div>
  );
}