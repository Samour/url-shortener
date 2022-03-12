import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {LinkStatus} from 'src/dto/LinksResponse';
import {LinkDetail} from 'src/store/model/LinkDetails';
import {AppState} from 'src/store/model';
import {useUpdateLink} from 'src/services/linkManagement';

interface State {
  link: LinkDetail;
}

const selector = (state: AppState): State => ({
  link: state.linkDetails.links.find(({id}) => id === state.linkDetails.linkInViewId)!,
});

export const useLinkEditForm = () => {
  const {link} = useSelector(selector);
  const navigate = useNavigate();
  const updateLink = useUpdateLink();

  const [label, setLabel] = useState('');
  const [status, setStatus] = useState(LinkStatus.ACTIVE);
  const [submitInProgress, setSubmitInProgress] = useState(false);

  const labelError: string | null = label === '' ? 'Link must have a label' : null;
  const allowSubmit = !labelError && (label !== link.label || status !== link.status);

  const submit = async (): Promise<void> => {
    setSubmitInProgress(true);
    try {
      await updateLink({label, status});
      navigate('/');
    } catch (e) {
      console.error('Error occurred trying to update link', e);
      setSubmitInProgress(false);
    }
  };

  return {
    label,
    labelError,
    setLabel,
    status,
    setStatus,
    allowSubmit,
    submitInProgress,
    submit,
  };
};
