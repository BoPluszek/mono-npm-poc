import * as React from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { VscHistory } from "react-icons/vsc";
import { format } from "date-fns";

export interface IItemProps {
  id: number | string;
  text: string;
  timestamp: Date;
}

export interface IProps {
  title: string;
  items: IItemProps[];
  className?: string;
}

export const EntityHistoryModal = ({ title, items, className }: IProps) => {
  const [show, setShow] = React.useState(false);

  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  return (
    <>
      <Button variant="light" size="sm" onClick={handleShow} className={className}>
        <VscHistory />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {items.map((item, i) => (
            <Alert variant="light" key={item.id ?? i} className="bg-light">
              <div>{item.text}</div>
              <div className="text-end">
                <small className="font-italic">{format(item.timestamp, "'d.' dd/MM-yyyy 'kl.' hh:mm")}</small>
              </div>
            </Alert>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Luk
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
