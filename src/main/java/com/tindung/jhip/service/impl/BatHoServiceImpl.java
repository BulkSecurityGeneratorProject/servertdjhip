package com.tindung.jhip.service.impl;

import com.tindung.jhip.service.BatHoService;
import com.tindung.jhip.domain.BatHo;
import com.tindung.jhip.domain.KhachHang;
import com.tindung.jhip.domain.LichSuDongTien;
import com.tindung.jhip.domain.NhatKy;
import com.tindung.jhip.domain.enumeration.DONGTIEN;
import com.tindung.jhip.domain.enumeration.LOAIHOPDONG;
import com.tindung.jhip.repository.BatHoRepository;
import com.tindung.jhip.repository.LichSuDongTienRepository;
import com.tindung.jhip.security.AuthoritiesConstants;
import com.tindung.jhip.security.SecurityUtils;
import com.tindung.jhip.service.CuaHangService;
import com.tindung.jhip.service.HopDongService;
import com.tindung.jhip.service.LichSuDongTienService;
import com.tindung.jhip.service.LichSuThaoTacHopDongService;
import com.tindung.jhip.service.NhanVienService;
import com.tindung.jhip.service.dto.BatHoDTO;
import com.tindung.jhip.service.dto.GhiNoDTO;
import com.tindung.jhip.service.dto.HopDongDTO;
import com.tindung.jhip.service.dto.KhachHangDTO;
import com.tindung.jhip.service.dto.LichSuDongTienDTO;
import com.tindung.jhip.service.dto.LichSuThaoTacHopDongDTO;
import com.tindung.jhip.service.dto.NhanVienDTO;
import com.tindung.jhip.service.mapper.BatHoMapper;
import com.tindung.jhip.service.mapper.LichSuDongTienMapper;
import com.tindung.jhip.service.GhiNoService;
import com.tindung.jhip.domain.enumeration.NOTRA;
import com.tindung.jhip.domain.enumeration.StatusKhachHang;
import com.tindung.jhip.domain.enumeration.THUCHI;
import com.tindung.jhip.domain.enumeration.TRANGTHAIHOPDONG;
import com.tindung.jhip.domain.enumeration.TrangThaiKhachHang;
import com.tindung.jhip.repository.GhiNoRepository;
import com.tindung.jhip.repository.HopDongRepository;
import com.tindung.jhip.repository.KhachHangRepository;
import com.tindung.jhip.repository.ThuChiRepository;
import com.tindung.jhip.repository.VayLaiRepository;
import com.tindung.jhip.service.KhachHangService;
import com.tindung.jhip.service.NhatKyService;
import com.tindung.jhip.service.dto.NhatKyDTO;
import com.tindung.jhip.service.mapper.KhachHangMapper;
import com.tindung.jhip.web.rest.errors.BadRequestAlertException;
import com.tindung.jhip.web.rest.errors.InternalServerErrorException;
import java.sql.Date;
import java.time.ZonedDateTime;
import java.util.HashSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing BatHo.
 */
@Service
@Transactional
public class BatHoServiceImpl implements BatHoService {

    private final Logger log = LoggerFactory.getLogger(BatHoServiceImpl.class);

    private final BatHoMapper batHoMapper;
    private final BatHoRepository batHoRepository;
    private final HopDongRepository hopDongRepository;
    private final HopDongService hopDongService;
    private final NhatKyService nhatKyService;
    private final VayLaiRepository vayLaiRepository;
    private final KhachHangRepository khachHangRepository;
    private final KhachHangMapper khachHangMapper;
    private final KhachHangService khachHangService;
    private final NhanVienService nhanVienService;
    private final CuaHangService cuaHangService;
    private final LichSuDongTienService lichSuDongTienService;
    private final LichSuDongTienRepository lichSuDongTienRepository;
    private final LichSuDongTienMapper lichSuDongTienMapper;
    private final LichSuThaoTacHopDongService lichSuThaoTacHopDongService;
    private final GhiNoRepository ghiNoRepository;
    private final ThuChiRepository thuChiRepository;

    public BatHoServiceImpl(BatHoMapper batHoMapper, BatHoRepository batHoRepository,
            HopDongRepository hopDongRepository, HopDongService hopDongService, NhatKyService nhatKyService,
            VayLaiRepository vayLaiRepository, KhachHangRepository khachHangRepository, KhachHangMapper khachHangMapper,
            KhachHangService khachHangService, NhanVienService nhanVienService, CuaHangService cuaHangService,
            LichSuDongTienService lichSuDongTienService, LichSuDongTienRepository lichSuDongTienRepository,
            LichSuDongTienMapper lichSuDongTienMapper, LichSuThaoTacHopDongService lichSuThaoTacHopDongService,
            GhiNoRepository ghiNoRepository, ThuChiRepository thuChiRepository) {
        this.batHoMapper = batHoMapper;
        this.batHoRepository = batHoRepository;
        this.hopDongRepository = hopDongRepository;
        this.hopDongService = hopDongService;
        this.nhatKyService = nhatKyService;
        this.vayLaiRepository = vayLaiRepository;
        this.khachHangRepository = khachHangRepository;
        this.khachHangMapper = khachHangMapper;
        this.khachHangService = khachHangService;
        this.nhanVienService = nhanVienService;
        this.cuaHangService = cuaHangService;
        this.lichSuDongTienService = lichSuDongTienService;
        this.lichSuDongTienRepository = lichSuDongTienRepository;
        this.lichSuDongTienMapper = lichSuDongTienMapper;
        this.lichSuThaoTacHopDongService = lichSuThaoTacHopDongService;
        this.ghiNoRepository = ghiNoRepository;
        this.thuChiRepository = thuChiRepository;
    }

    /**
     * Save a batHo.
     *
     * @param batHoDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public BatHoDTO save(BatHoDTO batHoDTO) {
        log.debug("Request to save BatHo : {}", batHoDTO);
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STOREADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STAFFADMIN)) {

            validate(batHoDTO);
            if (batHoDTO.getId() == null) { // add new bat ho
                if (batHoDTO.getTienduakhach() <= quanLyVon()
                        && khachHangRepository.findOne(batHoDTO.getHopdong().getKhachHangId()).getStatus()
                                .equals(StatusKhachHang.DUNGHOATDONG)) {
                    HopDongDTO hopdong = batHoDTO.getHopdong();
                    hopdong.setLoaihopdong(LOAIHOPDONG.BATHO);
                    hopdong.setCuaHangId(cuaHangService.findIDByUserLogin());
                    NhanVienDTO findByUserLogin = nhanVienService.findByUserLogin();
                    hopdong.setNhanVienId(findByUserLogin.getId());
                    if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
                        Long idCuaHang = cuaHangService.findIDByUserLogin();
                        hopdong.setCuaHangId(idCuaHang);
                    }

                    hopdong.setNgaytao(ZonedDateTime.now());
                    hopdong.setTrangthaihopdong(TRANGTHAIHOPDONG.DANGVAY);
                    hopdong = hopDongService.save(hopdong);
                    batHoDTO.setHopdong(hopdong);
                    khachHangService.setStatus(hopdong.getKhachHangId(), StatusKhachHang.HOATDONG);
                    BatHo batHo = batHoMapper.toEntity(batHoDTO);
                    batHo = batHoRepository.save(batHo);

                    Integer chuky = batHo.getChuky();
                    Double tienduakhach = batHo.getTienduakhach();
                    Integer tongsongay = batHo.getTongsongay();
                    Double tongtien = batHo.getTongtien();
                    ZonedDateTime ngaytao = hopdong.getNgaytao();

                    ZonedDateTime batdau = ngaytao;
                    // Date date = new Date(batdau.)
                    // batdau.format(DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT))
                    int soChuKy = tongsongay / chuky;
                    if (tongsongay % chuky != 0) {
                        soChuKy++;
                    }

                    long soTienTrongChuKy = Math.round((tongtien / soChuKy) / 1000) * 1000;// lam tron den 1000d
                    for (int i = 0; i < soChuKy - 1; i++) {
                        LichSuDongTienDTO lichSuDongTienDTO = new LichSuDongTienDTO();
                        lichSuDongTienDTO.setHopDongId(hopdong.getId());
                        lichSuDongTienDTO.setNhanVienId(nhanVienService.findByUserLogin().getId());
                        lichSuDongTienDTO.setNgaybatdau(batdau);
                        batdau = batdau.plusDays(chuky);
                        lichSuDongTienDTO.setNgayketthuc(batdau);
                        lichSuDongTienDTO.setSotien(soTienTrongChuKy * 1d);
                        lichSuDongTienDTO.setTrangthai(DONGTIEN.CHUADONG);
                        lichSuDongTienService.save(lichSuDongTienDTO);
                    }
                    // phat cuoi
                    LichSuDongTienDTO lichSuDongTienDTO = new LichSuDongTienDTO();
                    lichSuDongTienDTO.setHopDongId(hopdong.getId());
                    lichSuDongTienDTO.setNhanVienId(nhanVienService.findByUserLogin().getId());
                    lichSuDongTienDTO.setNgaybatdau(batdau);
                    batdau = ngaytao.plusDays(tongsongay);
                    lichSuDongTienDTO.setNgayketthuc(batdau);
                    lichSuDongTienDTO.setSotien(soTienTrongChuKy * 1d);
                    lichSuDongTienDTO.setTrangthai(DONGTIEN.CHUADONG);
                    lichSuDongTienService.save(lichSuDongTienDTO);

                    LichSuThaoTacHopDongDTO lichSuThaoTacHopDongDTO = new LichSuThaoTacHopDongDTO();
                    lichSuThaoTacHopDongDTO.setHopDongId(hopdong.getId());
                    lichSuThaoTacHopDongDTO.setNhanVienId(nhanVienService.findByUserLogin().getId());
                    lichSuThaoTacHopDongDTO.setNoidung("Tạo mới bát họ");
                    lichSuThaoTacHopDongDTO.setThoigian(ZonedDateTime.now());
                    lichSuThaoTacHopDongDTO.setSoTienGhiCo(0d);
                    lichSuThaoTacHopDongDTO.setSoTienGhiNo(batHo.getTienduakhach());
                    lichSuThaoTacHopDongService.save(lichSuThaoTacHopDongDTO);

                    NhatKyDTO nhatKy = new NhatKyDTO();
                    if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
                        nhatKy.setCuaHangId(cuaHangService.findIDByUserLogin());
                    }
                    nhatKy.setNhanVienId(findByUserLogin.getId());
                    nhatKy.setThoiGian(ZonedDateTime.now());
                    nhatKy.setNoiDung("Tạo mới bát họ");
                    nhatKyService.save(nhatKy);

                    return batHoMapper.toDto(batHo);
                } else {
                    throw new BadRequestAlertException("Không đủ tiền", null, null);
                }
            } else {
                throw new BadRequestAlertException("Không được sửa bat họ", null, null);
                // Long idCuaHang = cuaHangService.findIDByUserLogin();
                // BatHo findOne = batHoRepository.findOne(batHoDTO.getId());
                //
                // batHoDTO.getHopdong().setCuaHangId(idCuaHang);//de phong user thay doi
                // idcuahang
                // HopDongDTO hopdong = hopDongService.save(batHoDTO.getHopdong());
                // batHoDTO.setHopdong(hopdong);
                // double tienPhaiDong = 0;
                // List<LichSuDongTienDTO> LSDT =
                // lichSuDongTienService.findByHopDong(hopdong.getId());
                // for (LichSuDongTienDTO lichSuDongTienDTO : LSDT) {
                // if (lichSuDongTienDTO.getTrangthai().equals(DONGTIEN.CHUADONG)) {
                // tienPhaiDong += lichSuDongTienDTO.getSotien();
                // lichSuDongTienService.delete(lichSuDongTienDTO.getId());
                // }
                // }
                // List<GhiNoDTO> GN = ghiNoService.findByHopDong(hopdong.getId());
                // for (GhiNoDTO ghiNo : GN) {
                // if (ghiNo.getTrangthai().equals(NOTRA.NO)) {
                // tienPhaiDong += ghiNo.getSotien();
                // } else if (ghiNo.getTrangthai().equals(NOTRA.TRA)) {
                // tienPhaiDong = tienPhaiDong - ghiNo.getSotien();
                // }
                // ghiNoService.delete(ghiNo.getId());
                // }
                //
                // BatHo batHo = batHoMapper.toEntity(batHoDTO);
                // batHo = batHoRepository.save(batHo);
                // LichSuDongTienDTO lichSuDongTienDaoHo = new LichSuDongTienDTO();
                // lichSuDongTienDaoHo.setHopDongId(hopdong.getId());
                // lichSuDongTienDaoHo.setNhanVienId(nhanVienService.findByUserLogin().getId());
                // lichSuDongTienDaoHo.setNgaybatdau(ZonedDateTime.now());
                // lichSuDongTienDaoHo.setNgayketthuc(ZonedDateTime.now());
                // lichSuDongTienDaoHo.setSotien(tienPhaiDong * 1d);
                // lichSuDongTienDaoHo.setTrangthai(DONGTIEN.DADONG);
                // lichSuDongTienService.save(lichSuDongTienDaoHo);
                // Integer chuky = batHo.getChuky();
                // Double tienduakhach = batHo.getTienduakhach();
                // Integer tongsongay = batHo.getTongsongay();
                // Double tongtien = batHo.getTongtien();
                // ZonedDateTime ngaytao = hopdong.getNgaytao();
                //
                // ZonedDateTime batdau = ngaytao;
                //// Date date = new Date(batdau.)
                //// batdau.format(DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT))
                //
                // int soChuKy = tongsongay / chuky;
                // if (tongsongay % chuky != 0) {
                // soChuKy++;
                // }
                //
                // long soTienTrongChuKy = Math.round((tongtien / soChuKy)*1000)/1000;//lam tron
                // den 1000d
                // for (int i = 0; i < soChuKy - 1; i++) {
                // LichSuDongTienDTO lichSuDongTienDTO = new LichSuDongTienDTO();
                // lichSuDongTienDTO.setHopDongId(hopdong.getId());
                // lichSuDongTienDTO.setNhanVienId(nhanVienService.findByUserLogin().getId());
                // lichSuDongTienDTO.setNgaybatdau(batdau);
                // batdau = batdau.plusDays(chuky);
                // lichSuDongTienDTO.setNgayketthuc(batdau);
                // lichSuDongTienDTO.setSotien(soTienTrongChuKy * 1d);
                // lichSuDongTienDTO.setTrangthai(DONGTIEN.CHUADONG);
                // lichSuDongTienService.save(lichSuDongTienDTO);
                // }
                // //phat cuoi
                // LichSuDongTienDTO lichSuDongTienDTO = new LichSuDongTienDTO();
                // lichSuDongTienDTO.setHopDongId(hopdong.getId());
                // lichSuDongTienDTO.setNhanVienId(nhanVienService.findByUserLogin().getId());
                // lichSuDongTienDTO.setNgaybatdau(batdau);
                // batdau = ngaytao.plusDays(tongsongay);
                // lichSuDongTienDTO.setNgayketthuc(batdau);
                // lichSuDongTienDTO.setSotien(soTienTrongChuKy * 1d);
                // lichSuDongTienDTO.setTrangthai(DONGTIEN.CHUADONG);
                // lichSuDongTienService.save(lichSuDongTienDTO);
                // return batHoMapper.toDto(batHo);

            }
        }
        throw new BadRequestAlertException("không có quyền", null, null);

    }

    @Override
    public BatHoDTO daoHo(BatHoDTO batHoDTO, Long id, String mahopdong) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STOREADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STAFFADMIN)) {
            if (batHoDTO.getTienduakhach() < quanLyVon() &&hopDongRepository.findOne(id).getTrangthaihopdong()!=TRANGTHAIHOPDONG.DADONG) {
                HopDongDTO hopdong = new HopDongDTO();
                hopdong.setLoaihopdong(LOAIHOPDONG.BATHO);
                hopdong.setCuaHangId(cuaHangService.findIDByUserLogin());
                NhanVienDTO findByUserLogin = nhanVienService.findByUserLogin();
                hopdong.setNhanVienId(findByUserLogin.getId());
                if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
                    Long idCuaHang = cuaHangService.findIDByUserLogin();
                    hopdong.setCuaHangId(idCuaHang);
                }
                hopdong.setMahopdong(mahopdong);
                hopdong.setHopdonggocId(id);
                hopdong.setNgaytao(ZonedDateTime.now());
                hopdong.setTrangthaihopdong(TRANGTHAIHOPDONG.DANGVAY);
                hopdong.setKhachHangId(hopDongService.findOne(id).getKhachHangId());
                hopdong = hopDongService.save(hopdong);
                batHoDTO.setHopdong(hopdong);
                khachHangService.setStatus(hopdong.getKhachHangId(), StatusKhachHang.HOATDONG);
                BatHo batHo = batHoMapper.toEntity(batHoDTO);
                batHo = batHoRepository.save(batHo);
                Integer chuky = batHo.getChuky();
                Double tienduakhach = batHo.getTienduakhach();
                Integer tongsongay = batHo.getTongsongay();
                Double tongtien = batHo.getTongtien();
                ZonedDateTime ngaytao = hopdong.getNgaytao();

                ZonedDateTime batdau = ngaytao;
                // Date date = new Date(batdau.)
                // batdau.format(DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT))
                int soChuKy = tongsongay / chuky;
                if (tongsongay % chuky != 0) {
                    soChuKy++;
                }

                long soTienTrongChuKy = Math.round((tongtien / soChuKy) / 1000) * 1000;// lam tron den 1000d
                for (int i = 0; i < soChuKy - 1; i++) {
                    LichSuDongTienDTO lichSuDongTienDTO = new LichSuDongTienDTO();
                    lichSuDongTienDTO.setHopDongId(hopdong.getId());
                    lichSuDongTienDTO.setNhanVienId(nhanVienService.findByUserLogin().getId());
                    lichSuDongTienDTO.setNgaybatdau(batdau);
                    batdau = batdau.plusDays(chuky);
                    lichSuDongTienDTO.setNgayketthuc(batdau);
                    lichSuDongTienDTO.setSotien(soTienTrongChuKy * 1d);
                    lichSuDongTienDTO.setTrangthai(DONGTIEN.CHUADONG);
                    lichSuDongTienService.save(lichSuDongTienDTO);
                }
                // phat cuoi
                LichSuDongTienDTO lichSuDongTienDTO = new LichSuDongTienDTO();
                lichSuDongTienDTO.setHopDongId(hopdong.getId());
                lichSuDongTienDTO.setNhanVienId(nhanVienService.findByUserLogin().getId());
                lichSuDongTienDTO.setNgaybatdau(batdau);
                batdau = ngaytao.plusDays(tongsongay);
                lichSuDongTienDTO.setNgayketthuc(batdau);
                lichSuDongTienDTO.setSotien(soTienTrongChuKy * 1d);
                lichSuDongTienDTO.setTrangthai(DONGTIEN.CHUADONG);
                lichSuDongTienService.save(lichSuDongTienDTO);

                LichSuThaoTacHopDongDTO lichSuThaoTacHopDong = new LichSuThaoTacHopDongDTO();
                lichSuThaoTacHopDong.setHopDongId(hopdong.getId());
                lichSuThaoTacHopDong.setNhanVienId(cuaHangService.findIDByUserLogin());
                lichSuThaoTacHopDong.setSoTienGhiCo(0d);
                lichSuThaoTacHopDong.setSoTienGhiNo(0d);
                lichSuThaoTacHopDong.setThoigian(ZonedDateTime.now());
                lichSuThaoTacHopDong.setNoidung("Đảo họ");
                lichSuThaoTacHopDongService.save(lichSuThaoTacHopDong);

                NhatKyDTO nhatKy = new NhatKyDTO();
                if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
                    nhatKy.setCuaHangId(cuaHangService.findIDByUserLogin());
                }
                nhatKy.setNhanVienId(findByUserLogin.getId());
                nhatKy.setThoiGian(ZonedDateTime.now());
                nhatKy.setNoiDung("Đảo họ");
                nhatKyService.save(nhatKy);

                return batHoMapper.toDto(batHo);
            } else {
                throw new BadRequestAlertException("Không đủ tiền", null, null);
            }

        } else {
            throw new BadRequestAlertException("không có quyền", null, null);
        }
    }

    /**
     * Get all the batHos.
     *
     * @param trangthai
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<BatHoDTO> findAll(TRANGTHAIHOPDONG trangthai) {
        log.debug("Request to get all BatHos");

        String login = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new InternalServerErrorException("Current user login not found"));
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.KETOAN)) {
            LinkedList<BatHoDTO> collect = batHoRepository.findByTrangThaiHopDongAdmin(trangthai).stream()
                    .map(batHoMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
            return collect;
        } else {
            Long idCuaHang = cuaHangService.findIDByUserLogin();
            LinkedList<BatHoDTO> collect = batHoRepository.findByTrangThaiHopDong(trangthai, idCuaHang).stream()
                    .map(batHoMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
            return collect;

        }
    }

    /**
     * Get one batHo by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public BatHoDTO findOne(Long id) {
        log.debug("Request to get BatHo : {}", id);
        String login = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new InternalServerErrorException("Current user login not found"));
        BatHo batHo = null;
        batHo = batHoRepository.findOne(id);
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.KETOAN)) {
            return batHoMapper.toDto(batHo);

        } else {
            Long idCuaHang = cuaHangService.findIDByUserLogin();
            if (batHo.getHopdongbh().getCuaHang().getId() == idCuaHang) {
                return batHoMapper.toDto(batHo);
            }
            return null;

        }
    }

    /**
     * Delete the batHo by id. F
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete BatHo : {}", id);
        if ((SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STOREADMIN))) {
            Long idCuaHang = cuaHangService.findIDByUserLogin();
            BatHoDTO findOne = findOne(id);
            if (findOne.getHopdong().getCuaHangId() == idCuaHang) {
                batHoRepository.delete(id);
                hopDongService.delete(findOne.getHopdong().getId());
                return;
            }

        }
        throw new BadRequestAlertException("không có quyền", null, null);
    }

    @Override
    public LichSuDongTienDTO setDongTien(Long id) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STOREADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STAFFADMIN)) {
            LichSuDongTien lichSuDongTien = null;
            lichSuDongTien = lichSuDongTienRepository.findOne(id);
            lichSuDongTien.setTrangthai(DONGTIEN.DADONG);

            NhatKyDTO nhatKy = new NhatKyDTO();
            if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
                nhatKy.setCuaHangId(cuaHangService.findIDByUserLogin());
            }
            nhatKy.setNhanVienId(nhanVienService.findByUserLogin().getId());
            nhatKy.setThoiGian(ZonedDateTime.now());
            nhatKy.setNoiDung("Đóng tiền bát họ");
            nhatKyService.save(nhatKy);

            return lichSuDongTienMapper.toDto(lichSuDongTien);
        }
        throw new BadRequestAlertException("không có quyền", null, null);
    }

    @Override
    public List<BatHoDTO> findByNameOrCMND(String key,TRANGTHAIHOPDONG trangthai) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            log.debug("Request to get all KhachHangs");
            key = new StringBuffer("%").append(key).append("%").toString();
            return batHoRepository.findByNameOrCMNDAdmin(key,trangthai).stream().map(batHoMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
        } else if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STOREADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STAFFADMIN)) {
            log.debug("Request to get all KhachHangs");
            key = new StringBuffer("%").append(key).append("%").toString();
            Long idcuaHang = cuaHangService.findIDByUserLogin();
            return batHoRepository.findByNameOrCMND(key, idcuaHang,trangthai).stream().map(batHoMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
        }
        throw new BadRequestAlertException("không có quyền", null, null);
    }

    @Override
    public List<BatHoDTO> findByNameOrCMNDAdmin(String key, Long id,TRANGTHAIHOPDONG trangthai) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STOREADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STAFFADMIN)) {
            log.debug("Request to get all KhachHangs");
            key = new StringBuffer("%").append(key).append("%").toString();
            return batHoRepository.findByNameOrCMND(key, id,trangthai).stream().map(batHoMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
        }
        throw new BadRequestAlertException("không có quyền", null, null);
    }

    private void validate(BatHoDTO bh) {

        if (bh.getTongsongay() < 0) {
            throw new BadRequestAlertException("thông tin bát họ - tổng số ngày không đúng", null, null);
        }

        if (bh.getChuky() < 0 || bh.getChuky() > bh.getTongsongay()) {
            throw new BadRequestAlertException("thông tin bát họ - chu kỳ không đúng", null, null);
        }
        if (bh.getTongtien() < 0) {
            throw new BadRequestAlertException("thông tin bát họ -tổng tiền không đúng", null, null);

        }
        if (bh.getTienduakhach() < 0) {
            throw new BadRequestAlertException("thông tin bát họ -tiền đưa khách không đúng", null, null);

        }
    }

    // Tùng viết
    @Override
    @Transactional(readOnly = true)
    public List<BatHoDTO> findByCuaHangId(Long id) {

        List<BatHo> findByCuaHangId = batHoRepository.findAllByCuaHang(id);
        List<BatHoDTO> collect = findByCuaHangId.stream().map(batHoMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
        return collect;
    }

    // Tùng end
    @Override
    public BatHoDTO findByHopDong(Long id) {
        BatHo batHo = batHoRepository.findByHopDong(id);
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            return batHoMapper.toDto(batHo);

        } else {
            Long idCuaHang = cuaHangService.findIDByUserLogin();
            if (batHo.getHopdongbh().getCuaHang().getId() == idCuaHang) {
                return batHoMapper.toDto(batHo);
            }
            return null;

        }

    }

    @Override
    public List<BatHoDTO> baoCao(ZonedDateTime start, ZonedDateTime end, Long idNhanVien) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STOREADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STAFFADMIN)) {
            Long idCuaHang = cuaHangService.findIDByUserLogin();
            List<BatHo> baoCao = batHoRepository.baocaoNV(start, end, idCuaHang, idNhanVien);
            List<BatHoDTO> collect = baoCao.stream().map(batHoMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
            return collect;

        }
        throw new BadRequestAlertException("không có quyền", null, null);
    }

    @Override
    public List<BatHoDTO> baoCaoKeToan(ZonedDateTime start, ZonedDateTime end, Long idcuahang) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.KETOAN)) {

            List<BatHo> baoCao = batHoRepository.baocao(start, end, idcuahang);
            List<BatHoDTO> collect = baoCao.stream().map(batHoMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
            return collect;

        }
        throw new BadRequestAlertException("không có quyền", null, null);
    }

    @Override
    public List<BatHoDTO> findByNhanVien(Long idNhanVien) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)||SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.KETOAN)) {
            List<BatHo> findByNV = batHoRepository.findAllByNhanVien(idNhanVien);
            List<BatHoDTO> collect = findByNV.stream().map(batHoMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
            return collect;

        }
        throw new BadRequestAlertException("không có quyền", null, null);
    }

    @Override
    public List<BatHoDTO> baoCao(ZonedDateTime start, ZonedDateTime end) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STOREADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STAFFADMIN)) {
            Long idCuaHang = cuaHangService.findIDByUserLogin();
            List<BatHo> baoCao = batHoRepository.baocao(start, end, idCuaHang);
            List<BatHoDTO> collect = baoCao.stream().map(batHoMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
            return collect;

        }
        throw new BadRequestAlertException("không có quyền", null, null);
    }

    @Override
    public List<BatHoDTO> findByTrangThai(ZonedDateTime start, ZonedDateTime end, TRANGTHAIHOPDONG trangthai) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STOREADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STAFFADMIN)) {
            Long idCuaHang = cuaHangService.findIDByUserLogin();
            List<BatHo> baoCao = batHoRepository.findByTrangThai(start, end, trangthai, idCuaHang);
            List<BatHoDTO> collect = baoCao.stream().map(batHoMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
            return collect;

        }
        throw new InternalServerErrorException("Khong co quyen");
    }

    @Override
    public List<BatHoDTO> findByTrangThaiHopDong(TRANGTHAIHOPDONG trangthai) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STOREADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STAFFADMIN)) {
            Long idCuaHang = cuaHangService.findIDByUserLogin();
            List<BatHo> baoCao = batHoRepository.findByTrangThaiHopDong(trangthai, idCuaHang);
            List<BatHoDTO> collect = baoCao.stream().map(batHoMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
            return collect;

        }
        throw new BadRequestAlertException("không có quyền", null, null);
    }

    @Override
    public List<BatHoDTO> findByTrangThaiNV(ZonedDateTime start, ZonedDateTime end, TRANGTHAIHOPDONG trangthai,
            Long id) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STOREADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STAFFADMIN)) {
            Long idCuaHang = cuaHangService.findIDByUserLogin();
            List<BatHo> baoCao = batHoRepository.findByTrangThaiNV(start, end, trangthai, idCuaHang, id);
            List<BatHoDTO> collect = baoCao.stream().map(batHoMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
            return collect;

        }
        throw new BadRequestAlertException("không có quyền", null, null);
    }

    @Override
    public Double quanLyVon() {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STOREADMIN)
                || SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.STAFFADMIN)) {
            Long idCuaHang = cuaHangService.findIDByUserLogin();

            Double tienDuaKhachBatHo = batHoRepository.tienDuaKhach(idCuaHang).orElse(0d);
            Double tienNo = ghiNoRepository.tienNo(NOTRA.NO, idCuaHang).orElse(0d);
            ;
            Double tienTraNo = ghiNoRepository.tienNo(NOTRA.TRA, idCuaHang).orElse(0d);
            ;
            Double tienVayDuaKhach = vayLaiRepository.tienVayDuaKhach(idCuaHang).orElse(0d);
            ;
            Double lichSuThuTienVayLaiBatHo = lichSuDongTienRepository.lichSuDongTien(DONGTIEN.DADONG, idCuaHang)
                    .orElse(0d);
            ;
            Double tienTraGocVayLai = lichSuDongTienRepository.lichSuDongTien(DONGTIEN.TRAGOC, idCuaHang).orElse(0d);
            ;
            Double thu = thuChiRepository.thuchi(THUCHI.THU, idCuaHang).orElse(0d);
            ;
            Double chi = thuChiRepository.thuchi(THUCHI.CHI, idCuaHang).orElse(0d);
            ;
            Double gopVon = thuChiRepository.thuchi(THUCHI.GOPVON, idCuaHang).orElse(0d);
            ;
            Double rutVon = thuChiRepository.thuchi(THUCHI.RUTVON, idCuaHang).orElse(0d);
            ;

            Double nguonvon = 0d;
            nguonvon = (gopVon + thu + lichSuThuTienVayLaiBatHo + tienTraNo + tienTraGocVayLai)
                    - (tienDuaKhachBatHo + tienVayDuaKhach + tienNo + chi + rutVon);
            return nguonvon;
        }
        throw new BadRequestAlertException("không có quyền", null, null);
    }


    @Override
    public Double quanLyVonByKeToan(Long idCuaHang) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.KETOAN)) {

            Double tienDuaKhachBatHo = batHoRepository.tienDuaKhach(idCuaHang).orElse(0d);
            Double tienNo = ghiNoRepository.tienNo(NOTRA.NO, idCuaHang).orElse(0d);
            ;
            Double tienTraNo = ghiNoRepository.tienNo(NOTRA.TRA, idCuaHang).orElse(0d);
            ;
            Double tienVayDuaKhach = vayLaiRepository.tienVayDuaKhach(idCuaHang).orElse(0d);
            ;
            Double lichSuThuTienVayLaiBatHo = lichSuDongTienRepository.lichSuDongTien(DONGTIEN.DADONG, idCuaHang)
                    .orElse(0d);
            ;
            Double tienTraGocVayLai = lichSuDongTienRepository.lichSuDongTien(DONGTIEN.TRAGOC, idCuaHang).orElse(0d);
            ;
            Double thu = thuChiRepository.thuchi(THUCHI.THU, idCuaHang).orElse(0d);
            ;
            Double chi = thuChiRepository.thuchi(THUCHI.CHI, idCuaHang).orElse(0d);
            ;
            Double gopVon = thuChiRepository.thuchi(THUCHI.GOPVON, idCuaHang).orElse(0d);
            ;
            Double rutVon = thuChiRepository.thuchi(THUCHI.RUTVON, idCuaHang).orElse(0d);
            ;

            Double nguonvon = 0d;
            nguonvon = (gopVon + thu + lichSuThuTienVayLaiBatHo + tienTraNo + tienTraGocVayLai)
                    - (tienDuaKhachBatHo + tienVayDuaKhach + tienNo + chi + rutVon);
            return nguonvon;
        }
        throw new BadRequestAlertException("không có quyền", null, null);
    }

    @Override
    public List<BatHoDTO> findByTrangThaiKeToan(ZonedDateTime start, ZonedDateTime end, TRANGTHAIHOPDONG trangthai,
            Long idCuaHang) {
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.KETOAN)) {
            List<BatHo> baoCao = batHoRepository.findByTrangThai(start, end, trangthai, idCuaHang);
            List<BatHoDTO> collect = baoCao.stream().map(batHoMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
            return collect;

        }
        throw new InternalServerErrorException("Khong co quyen");
    }

}
