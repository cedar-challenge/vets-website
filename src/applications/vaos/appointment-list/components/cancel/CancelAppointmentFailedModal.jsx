import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

import FacilityAddress from '../../../components/FacilityAddress';

export default function CancelAppointmentFailedModal({
  facility,
  isConfirmed,
  isBadRequest,
  onClose,
}) {
  const typeText = isConfirmed ? 'appointment' : 'request';
  return (
    <Modal
      id="cancelAppt"
      status="error"
      visible
      onClose={onClose}
      title={`We couldn’t cancel your ${typeText}`}
    >
      {isBadRequest ? (
        <p>
          We’re sorry. You can’t cancel your {typeText} on the VA appointments
          tool. Please contact your local VA medical center to cancel this
          appointment:
        </p>
      ) : (
        <p>
          Something went wrong when we tried to cancel this {typeText}. Please
          contact your medical center to cancel:
        </p>
      )}
      <p>
        {facility ? (
          <>
            <strong>{facility.name}</strong>
            <br />
          </>
        ) : null}
        {!!facility && <FacilityAddress facility={facility} />}
        {!facility && (
          <>
            <a target="_blank" rel="noopener noreferrer" href="/find-locations">
              Find facility contact information
            </a>
          </>
        )}
      </p>
    </Modal>
  );
}
